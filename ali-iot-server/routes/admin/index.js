module.exports = app=>{
    const router = require('express').Router({
        mergeParams: true
    });

    // 创建
    router.post('/',async(req,res)=>{
        const model = await req.Model.create(req.body)
        res.send(model)
    })

    // 编辑
    router.put('/:id',async(req,res)=>{
        const model = await req.Model.findByIdAndUpdate(req.params.id,req.body)
        console.log(model);
        res.send(model)
    })

    // 删除
    router.delete('/:id',async(req,res)=>{
        await req.Model.findByIdAndDelete(req.params.id,req.body)
        res.send({
            success: true
        })
    })

    // get一个
    router.get('/:id',async(req,res)=>{
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    // get列表
    router.get('/',async(req,res)=>{
        const queryOptions = {}
        // 关联查询
        if(req.Model.modelName === 'Record'){
            queryOptions.populate = 'deviceId'
        }
        if(req.Model.modelName === 'Device'){
            queryOptions.populate = 'theMapId'
        }
        const items = await req.Model.find().setOptions(queryOptions)
        res.send(items)
    })

    app.use('/admin/api/rest/:resource', async(req,res,next)=>{
        const modelName = require('inflection').classify(req.params.resource)
        console.log(modelName)
        // req.Model = require(`../../models/${modelName}`)
        req.Model = app.get(modelName)
        next()
    },router)

    app.use(async (err,req,res,next)=>{
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
};