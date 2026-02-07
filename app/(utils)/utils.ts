
export function MyResponse(error: boolean, message: string, data: any, {status = 200} : {status : number}){
    return Response.json({ error, data, message }, {status : status});
}
export function ErrorResponse(data: any){
    return Response.json({ error : true, data, message : "Some Error Occured" });
}

export const myHeaders = { "Content-Type": "application/json" };

export function formateDate(date : Date | null | undefined){
    if(date == null || date == undefined){
        return "00/00/0000";
    }
    const formatedDate =( new Date(date)).toLocaleDateString("en-GB");
    return formatedDate;
}