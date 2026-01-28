
export function MyResponse(error: boolean, message: string, data: any, {status = 200} : {status : number}){
    return Response.json({ error, data, message }, {status : status});
}
export function ErrorResponse(data: any){
    return Response.json({ error : true, data, message : "Some Error Occured" }, {status : 500});
}

export const myHeaders = { "Content-Type": "application/json" };