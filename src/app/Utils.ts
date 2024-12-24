import axios from 'axios';
export const addInterceptorToAxios = (headers: any) => {
    axios.interceptors.request.use((config: any) => {
        config.headers = { ...config.headers, ...headers };
        // Do something before request is sent
        return config;
    }, (error: any) => {
        // Do something with request error
        return Promise.reject(error);
    });

}
export const getRole = (user: any) => {
    if (!user) return 'admin';
    const { barberos, clientes, email } = user;
    if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL)
        return 'admin';
    if (barberos.length) {
        return 'encargado';
    }
    if (clientes.length) {
        return 'cliente';
    }
    return 'admin';
}
export const getHeaders = (user:any) => {

    if(!user) return {};

    const { barberos, clientes, email } = user;

    if(getRole(user) === "admin")
        return {};

    const headers:any = { rol: getRole(user) };
   
    if(barberos.length){
        headers['local_id'] = barberos[0].local_id;
    }


    return headers;
    
}