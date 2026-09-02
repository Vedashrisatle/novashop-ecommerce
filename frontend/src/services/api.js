import axios from "axios";
const API_URL=import.meta.env.VITE_API_URL;
export const api=axios.create({baseURL:API_URL});
api.interceptors.request.use(c=>{const t=localStorage.getItem("token");if(t)c.headers.Authorization=`Bearer ${t}`;return c});
export const endpoints={
 register:d=>api.post("/api/auth/register",d),login:d=>api.post("/api/auth/login",d),me:()=>api.get("/api/auth/me"),
 products:p=>api.get("/api/products",{params:p}),product:id=>api.get(`/api/products/${id}`),
 createProduct:d=>api.post("/api/products",d),updateProduct:(id,d)=>api.put(`/api/products/${id}`,d),deleteProduct:id=>api.delete(`/api/products/${id}`),
 categories:()=>api.get("/api/categories"),createCategory:d=>api.post("/api/categories",d),updateCategory:(id,d)=>api.put(`/api/categories/${id}`,d),deleteCategory:id=>api.delete(`/api/categories/${id}`),
 cart:()=>api.get("/api/cart"),addCart:d=>api.post("/api/cart",d),updateCart:(id,d)=>api.put(`/api/cart/${id}`,d),deleteCart:id=>api.delete(`/api/cart/${id}`),
 orders:()=>api.get("/api/orders"),order:id=>api.get(`/api/orders/${id}`),createOrder:d=>api.post("/api/orders",d),updateOrder:(id,d)=>api.put(`/api/orders/${id}/status`,d),
 banners:()=>api.get("/api/banners"),createBanner:d=>api.post("/api/banners",d),updateBanner:(id,d)=>api.put(`/api/banners/${id}`,d),deleteBanner:id=>api.delete(`/api/banners/${id}`),
 testimonials:()=>api.get("/api/testimonials"),createTestimonial:d=>api.post("/api/testimonials",d),
 bookings:()=>api.get("/api/bookings"),createBooking:d=>api.post("/api/bookings",d),
 upload:f=>api.post("/api/upload",f,{headers:{"Content-Type":"multipart/form-data"}})
};
