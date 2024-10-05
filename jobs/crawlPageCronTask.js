const cron = require("node-cron");
const { crawlPost } = require("../Controllers/post.controller");



cron.schedule('0 6,8,18 * * *', async()=>{
        try{
                await crawlPost()
        }
        catch(err){
                console.log(err)
        }
})