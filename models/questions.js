const mongoose =  require('mongoose');

const questionSchema = new mongoose.Schema({
    question : { type : String ,default: ""},
    a : { type : String ,default: ""},
    b : { type : String ,default: ""},
    c : { type : String ,default: ""},
    d : { type : String ,default: ""},
    answer :   { type :  String , default: ""},// a,b,c,d
    status : { type: Number , default: 1 } // 1 - Active, 2- Delete
},{
    timestamps: true
})

/** SHOW Questions LIST*/
questionSchema.statics.showQuestionList =  function(cb){
    return this.find({        
        status : 1       
    }, cb);
}

/** SHOW Questions LIST*/
questionSchema.statics.showStudentQuestionList =  function(cb){
    return this.aggregate([
        {
           $match:{               
                status: 1               
           }
       },{
           $project: {
                question : 1,
                a : 1,
                b : 1,
                c : 1,
                d : 1                                    
           }
       }],cb);
}

/** INSERT QESTION IN QESTION COLLECTION */
questionSchema.statics.insertNewQuestion = function(questionObject,cb){    
    questionObject.save((err,newQuestion)=>{        
        cb(err,newQuestion)    
    })
}

/** UPDATE QUESTION DATA */
questionSchema.statics.updateQuestion = function(questionId,questionData,cb){
    return this.findOneAndUpdate({
        _id : mongoose.Types.ObjectId(questionId)
    },questionData,{
        new : true
    },cb)
}


/** DELETE QUESTION DATA */
questionSchema.statics.deleteQuestion = function(questionId,cb){
    return this.findOneAndUpdate({
        _id : mongoose.Types.ObjectId(questionId)
    },{
        status : 2
    },{
        new : true
    },cb)
}


module.exports = mongoose.model('questions', questionSchema);