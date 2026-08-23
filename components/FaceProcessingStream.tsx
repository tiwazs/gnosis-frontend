export type LoginDataModel = {
    email: string;
    password: string;
}

export type RtcOfferDataModel = {
    sdp: string;
    type: string;
}

export type GraphNode = {
    name: string;
    args: Record<string, unknown> | null;
}

export type ProcessingGraph = {
    origin: GraphNode;
    processor: GraphNode | null;
    destination: GraphNode;
}

export class ApiFaceProcessingService {
    // Class Variables
    // Signaling server url
    private apiUrl: string;

    constructor(apiUrl: string){
        this.apiUrl = apiUrl;
    }
    
    // Class Methods
    async postFaceProcessingStreamSDP(data: RtcOfferDataModel, apikey: string, graph: ProcessingGraph): Promise<any> {
        const payload = {
            ...graph,
            ...data,
        };

        const response = await fetch(`${this.apiUrl}/processing/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "69420",
                'Authorization': apikey
            },
            body: JSON.stringify(payload),
        })
        const body = await response.json();
        if (!response.ok) {
            throw new Error(body.error ?? `Signaling failed (${response.status})`);
        }
        return body;
    }
}

export class FaceProcessingStream{
    pc!: RTCPeerConnection;
    iceGatheringLog: string = 'iceGathering: ';
    iceConnectionLog: string = 'iceConnection: ';
    signalingLog: string = 'signaling: ';
    apiFaceProcessingService: ApiFaceProcessingService;
    video: MediaStream | null = null;

    constructor(apiUrl: string){
        this.apiFaceProcessingService = new ApiFaceProcessingService(apiUrl);
    }

    // Class Methods
    // Creating the peer connection and returns the peer connection object configured
    createPeerConnection():RTCPeerConnection {
        let config: any;
        //config= { sdpSemantics: 'unified-plan' };
        let pc = new RTCPeerConnection(  );

        pc.addEventListener('icegatheringstatechange', () => {
            this.iceGatheringLog = this.iceGatheringLog + ' -> ' + pc.iceGatheringState;
            console.log("Ice state gather: "+this.iceGatheringLog);
        }, false);
        this.iceGatheringLog = pc.iceGatheringState;

        pc.addEventListener('iceconnectionstatechange', () => {
            this.iceConnectionLog = this.iceConnectionLog + ' -> ' + pc.iceConnectionState;
            console.log("Ice state conn: "+this.iceGatheringLog);
        });
        this.iceConnectionLog = pc.iceConnectionState;

        pc.addEventListener('signalingstatechange', () => {
            this.signalingLog = this.signalingLog + ' -> ' + pc.signalingState;
            console.log("Signaling state: "+this.iceGatheringLog);
        });
        this.signalingLog = pc.signalingState;

        // Connect Audio / Video
        pc.ontrack = evt => {
            console.log("Track");    
            if (evt.track.kind == 'video')
                this.video = evt.streams[0];
        }

        return pc;
    }

    // Negotiating between peers through the Signaling Server.
    // This mis the core of the RTC connection and it works like this:
    // pc object creates a local offer, this is the local description sdp. then
    // Waits for Ice to complete. Then sends the offer to the  other peers
    // through an endpoint on the signaling server, the other peer sends the answer sdp
    // and then use this sdp to set the remote description and complete the connection
    negotiate = async (apikey: string, graph: ProcessingGraph): Promise<void> => {
        try{
            // Creates Offer sdp to set the local Description
            const offer = await this.pc.createOffer();
            await this.pc.setLocalDescription(offer);
            
            // wait for ICE gathering to complete
            await new Promise<void>((resolve) => {
                if (this.pc.iceGatheringState === 'complete') {
                    resolve();
                } else {
                    const checkState = () => {
                        if (this.pc.iceGatheringState === 'complete') {
                            this.pc.removeEventListener('icegatheringstatechange', checkState);
                            resolve();
                        }
                    }
                    this.pc.addEventListener('icegatheringstatechange', checkState);
                }
            });

            // Codec filtering and sending the offer to the Signaling server which will pass
            let codec:string = 'default';            
            if(codec !== 'default' ){
                console.log("not default");
                //offer!.sdp = this.sdpFilterCodec('video', codec, offer!.sdp);
            }
            
            // offer to the other peer
            let sdp:string = this.pc.localDescription!.sdp as string;
            let type:string = this.pc.localDescription!.type as string;
            let offerModel:RtcOfferDataModel = {sdp, type}
            
            // Sending the offer and getting the answer
            const answer = await this.apiFaceProcessingService.postFaceProcessingStreamSDP(offerModel, apikey, graph);

            // Setting the remote Description once an answer is gotten
            this.pc.setRemoteDescription(answer);
            console.log("Connection completed");
        }catch(error){
            // Something went wrong
            console.log('Error trying to establish connection');
            alert(error);
        };
    }

    // Function to start The WebRTC connection process
    async start(apikey: string, graph: ProcessingGraph): Promise<MediaStream> {
        let resolution: string;
        let resolution_vals: string[];
        let constraints: any;
        this.pc = this.createPeerConnection();

        // Setting up parameters
        constraints = { audio: false, video: false };
        //resolution = this.resolution_element.nativeElement.value;
        resolution = "960x540";

        if (resolution) { 
            resolution_vals = resolution.split('x');
            constraints['video'] = {
                width: parseInt(resolution[0], 0),
                height: parseInt(resolution[1], 0)
            };
        } else {
            constraints.video = true;
        }

        // Getting user Media (Critic PArt. Still a bit confusing)
        if (constraints.audio || constraints.video) {   
            try { 
                let stream: MediaStream = await navigator.mediaDevices.getUserMedia(constraints) ;
                stream.getTracks().forEach( (track) => { this.pc.addTrack(track, stream) } );
            } catch (error) {
                console.log(error);
            }
            await this.negotiate(apikey, graph);                
        } else {
            await this.negotiate(apikey, graph);
        }
        
        // Waiting for the video stream to be available before returning it
        return await new Promise((resolve, reject) => {
            let countDown = 10;
            console.log("Waiting for video stream");
            var videoWaitInterval = setInterval(()=> {
                if(this.video){
                    console.log("Video stream available");
                    resolve(this.video);
                    clearInterval(videoWaitInterval);
                }
                else{
                    countDown--;
                    if(countDown <= 0)
                        reject("No video stream available");
                        clearInterval(videoWaitInterval);
                }
            }, 500)
        });
    }

    stop(){
        if(!this.pc) return;

        // close transceivers
        if (this.pc.getTransceivers) {
            this.pc.getTransceivers().forEach((transceiver) => {
                if (transceiver.stop) {
                    transceiver.stop();
                }
            });
        }

        // close local audio / video
        this.pc.getSenders().forEach((sender) => {
            sender.track?.stop();
        });

        // close peer connection
        setTimeout(() => {
            this.pc.close();
        }, 500);
    }

    // Codec Filtering method. For when the default codecs are not selected.
    sdpFilterCodec(kind:string, codec:string, realSdp:any) {
        var allowed:number[] = [];
        var rtxRegex:RegExp = new RegExp('a=fmtp:(\\d+) apt=(\\d+)\r$');
        var codecRegex:RegExp = new RegExp('a=rtpmap:([0-9]+) ' + this.escapeRegExp(codec))
        var videoRegex:RegExp = new RegExp('(m=' + kind + ' .*?)( ([0-9]+))*\\s*$')
        var lines:string[] = realSdp.split('\n');
        var isKind:boolean = false;

        for (var i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('m=' + kind + ' ') ){
                isKind = true;
            } else if (lines[i].startsWith('m=')){
                isKind = false;
            }

            if (isKind) {
                var match:RegExpMatchArray|null = lines[i].match(codecRegex);
                if (match) {
                    allowed.push(parseInt(match[1]));
                }

                match = lines[i].match(rtxRegex);
                if (match && allowed.includes(parseInt(match[2])) ){
                    allowed.push(parseInt(match[1]));
                }
            }
        }

        var skipRegex:RegExp = new RegExp('a=(fmtp|rtcp-fb|rtpmap):([0-9]+)');
        var sdp:string = '';

        isKind = false;
        for (var i = 0; i < allowed.length; i++) {
            if (lines[i].startsWith('m=' + kind + ' ')) {
                isKind = true;
            } else if (lines[i].startsWith('m=')) {
                isKind = false;
            }

            if (isKind) {
                var skipMatch:RegExpMatchArray|null = lines[i].match(skipRegex);
                if (skipMatch && !allowed.includes(parseInt(skipMatch[2]))) {
                    continue;
                } else if (lines[i].match(videoRegex)) {
                    sdp += lines[i].replace(videoRegex, '$1 ' + allowed.join(' ')) + '\n';
                } else {
                    sdp += lines[i] + '\n';
                }
            } else {
                sdp += lines[i] + '\n';
            }
        }

        return sdp;
    }

    escapeRegExp(string:string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

}