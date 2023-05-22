const fetch = require("fetch")

const deleteProd = async (url,product)=>{
    const deleteBody = {
        "product": product,
    }

    const response = await fetch(url,{
        method:'DELETE',
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(deleteBody)
    })
}