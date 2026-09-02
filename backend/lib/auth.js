import jwt from"jsonwebtoken";export const token=u=>jwt.sign({id:u.id,email:u.email,role:u.role},process.env.JWT_SECRET,{expiresIn:"7d"});
export function auth(req,res,next){try{const h=req.headers.authorization||"";if(!h.startsWith("Bearer "))throw 0;req.user=jwt.verify(h.slice(7),process.env.JWT_SECRET);next()}catch{res.status(401).json({message:"Authentication required"})}}
export const admin=(req,res,next)=>req.user?.role==="admin"?next():res.status(403).json({message:"Admin access required"});
export const safe=u=>({id:u.id,name:u.name,email:u.email,phone:u.phone,role:u.role});
