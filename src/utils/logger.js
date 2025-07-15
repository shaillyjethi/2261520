const API_URL=process.env.REACT_APP_LOGGING_API;
const AUTH_TOKEN=process.env.REACT_APP_AUTH_TOKEN;
export const Log=(stack,level,packageName,messgae,data={})=>{
    const allowedStacks=["backend","frontend"];
    const allowedLevels=["debug","info","warn","error","fatal"];
    if(!allowedStacks.includes(stack.toLowerCase())){
        console.error('Invalid stack:${stack}');
        return;
    }
    if(!allowedLevels.includes(level.toLowerCase())){
        console.error('Invalid level:${level}');
        return;
    }

    const payload={
        stack:stack.toLowerCase(),
        level:level.toLowerCase(),
        package:packageName,message,
        ...data
    };
    fetch(API_URL,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ${AUTH_TOKEN}'
        },
        body:JSON.stringify(payload)
    })
    .then(response=>{
        if(!response.ok){
            console.error('Logging Failed',response.status);
        }
        return response.json();
    })
    .catch(error=>{
        console.error('Logging error:',error);
    });
};

export const logger={
    debug:(packageName,message,data)=>
        Log("frontend","debug",packageName,message,data),
    info:(packageName,message,data)=>
        Log("frontend","info",packageName,message,data),
    warn:(packageName,message,data)=>
         Log("frontend","warn",packageName,message,data),
    error:(packageName,message,data)=>
         Log("frontend","error",packageName,message,data),
    fatal:(packageName,message,data)=>
         Log("frontend","fatal",packageName,message,data),
};


