export const createTokenWithCode=async (code)=>{

const urlCode=`https://github.com/login/oauth/access_token` +
`?client_id=b1f0ff0f7467411c74e1` +
`&client_secret=c55e1ba49d8030aae2a18757cf18623cdda6cc43` +
`&code=${code}`;
    
    const res= await fetch(urlCode, {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            Accept:"application/json",
        }
    });
    console.log(res);

    return res.json();
}