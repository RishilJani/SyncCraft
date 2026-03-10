
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

export function customLog(obj : any){
    if(typeof obj == typeof []){
        console.log("[ ");
        obj.forEach( (e : any)=> {
            customLog(e);            
            console.log("\b\b ,");
        });
        console.log("\b\b] ");
    }else if(typeof obj == typeof {}){
        console.log("{");
        
        for (const key in obj) {
            console.log("\t", key, ":", obj[key]);
        }
        console.log("}");
    }else{
        console.log(obj + " ");
        
    }
}