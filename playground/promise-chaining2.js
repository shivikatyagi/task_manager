require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('61e4fdb03a1da445209d9803').then((task)=>{
//     console.log('task')
//     return Task.countDocuments({completed:false})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskAndCount = async(id)=>{
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed : false})
    return count
}
deleteTaskAndCount('61e4fd3209f6434c24d8f85c').then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})