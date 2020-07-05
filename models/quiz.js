const mongoose =  require('mongoose');

const quizSchema = new mongoose.Schema({
    user_id : { type : mongoose.Types.ObjectId , ref : 'users' },
    questions : [{ 
        question_id :{type : mongoose.Types.ObjectId , ref : 'questions' },        
        question :{type : String ,default: ""},     
        answer : { type : String ,default: "" },
        given_answer : { type : String ,default: "" },
        correct : { type : Boolean } 
    }],
    attempted_question : { type : Number ,default: 0 },
    correct_answer : { type : Number ,default: 0 },
    total_question : { type : Number ,default: 0 },
    timer : { type : String , default : "" }, 
    status : { type: Number , default: 1 } // 1 - Active, 2- Delete

},{
    timestamps: true
})

/** SHOW Questions LIST*/
quizSchema.statics.getAllQuizResult =  function(cb){
    return this.aggregate([
        {
            $match : {status : 1 }
        },
        {
            $lookup : {
                from : "users",
                localField : "user_id",
                foreignField : "_id",
                as : "user"
            }
        },
        { $unwind: '$user' },
        {
            $project: {
                attempted_question : 1 ,            
                correct_answer : 1,
                total_question : 1,
                timer : 1 ,
                username : '$user.username'
            }
        }
    ], cb);
}


/** INSERT QESTION IN QESTION COLLECTION */
quizSchema.statics.insertNewQuiz = function(quizObject,cb){    
    quizObject.save((err,newQuiz)=>{        
        cb(err,newQuiz)    
    })
}

module.exports = mongoose.model('quiz', quizSchema);