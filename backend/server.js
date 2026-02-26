
const express=require("express")
const app=express()

app.get("/cars",(req,res)=>{

res.json([
{name:"Toyota"},
{name:"BMW"}
])

})

app.listen(5000,()=>{
console.log("Server running")
})
