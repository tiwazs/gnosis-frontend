import type { NextApiRequest, NextApiResponse } from "next";
import userService from "../../../../services/userService";
import { createRouter } from "next-connect"
import { getToken } from "next-auth/jwt";

interface UserRequest extends NextApiRequest {
    query:
    {id: string;}
}

const router = createRouter<UserRequest, NextApiResponse>();

router.get( async (req: UserRequest, res: NextApiResponse) => {
    const token = await getToken({ req })
    if (!token) return res.status(401).json({"mesage":"Unauthorized"});
    const userId = String(token.uid || token.sub || "");
    if(userId !== req.query.id) return res.status(401).json({"mesage":"Unauthorized"});

    try{
        const user = await userService.genertateApiKey(req.query.id);
        if(user) return res.status(200).json(user);

        return res.status(404).json({message: "User not found."});
    }catch(error: any){
        return res.status(500).json({error: error.message});
    }
});

export default router.handler({
    onNoMatch(req: UserRequest, res: NextApiResponse){
        res.status(405).json({message: `Method ${req.method} Not Allowed`});
    }
});