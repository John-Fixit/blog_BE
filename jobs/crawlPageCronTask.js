const cron = require("node-cron");
const { crawlPost } = require("../Controllers/post.controller");



cron.schedule('6 16 * * *', async()=>{
        try{
                await crawlPost()
        }
        catch(err){
                console.log(err)
        }
})