import type { NextApiRequest, NextApiResponse } from "next";
import userService from "../../../services/userService";
import { createRouter } from "next-connect"
import { getToken } from "next-auth/jwt";

interface UserRequest extends NextApiRequest {
    query:
    {id: string;}
}

const router = createRouter<UserRequest, NextApiResponse>();

router.get( async (req: UserRequest, res: NextApiResponse) =>{
    const token = await getToken({ req })
    if (!token) return res.status(401).json({"mesage":"Unauthorized"});
    const userId = (token.sub || token.uid) as string;
    if(userId !== req.query.id) return res.status(401).json({"mesage":"Unauthorized"});

    const user = await userService.findById(req.query.id);
    return res.status(200).json(user);
});

router.put( async (req: UserRequest, res: NextApiResponse) =>{
    const token = await getToken({ req })
    if (!token) return res.status(401).json({"mesage":"Unauthorized"});
    const userId = (token.sub || token.uid) as string;
    if(userId !== req.query.id) return res.status(401).json({"mesage":"Unauthorized"});

    const { name, firstName, lastName, email, password, image } = req.body ?? {};
    const patch: Record<string, unknown> = {};
    if (name !== undefined) patch.name = name;
    if (firstName !== undefined) patch.firstName = firstName;
    if (lastName !== undefined) patch.lastName = lastName;
    if (email !== undefined) patch.email = email;
    if (image !== undefined) patch.image = image;
    if (password) patch.password = password;

    try {
        const user = await userService.update(req.query.id, patch as any);
        return res.status(200).json(user);
    } catch (e: any) {
        return res.status(400).json({ message: e.message ?? "Could not update user" });
    }
});

router.delete( async (req: UserRequest, res: NextApiResponse) =>{
    const token = await getToken({ req })
    if (!token) return res.status(401).json({"mesage":"Unauthorized"});
    if(token.sub !== req.query.id) return res.status(401).json({"mesage":"Unauthorized"});

    try{
        const user = await userService.delete(req.query.id);
        return res.status(200).json(user);
    }catch(e){
        return res.status(400).json({message: "Record to delete does not exist."});
    }
});

export default router.handler({
    onNoMatch(req: UserRequest, res: NextApiResponse){
        res.status(405).json({message: `Method ${req.method} Not Allowed`});
    }
});