const mongoose =  require('mongoose');

const userSchema = new mongoose.Schema({
    username : { type : String ,default: ""},
    password : { type : String ,default: ""},
    firstName : { type : String ,default: ""},
    lastName : { type : String ,default: ""},    
    role : { type: Number , default: 2 }, // 1 - Admin , 2 - User
    status : { type: Number , default: 1 } // 0 - Inactive, 1 - Active, 2- Delete
},{
    timestamps: true
})

/** CHECK FOR USERNAME/USER ALREADY EXISTS */
userSchema.statics.checkUserExists =  function(username,cb){
    return this.find({
        username: username,
        status: {
            $ne: 2
        },
        role : 2
    }, cb);
}


/** CHECK FOR ADMIN USERNAME/USER ALREADY EXISTS */
userSchema.statics.checkAdminUserExists =  function(username,cb){
    return this.find({
        username: username,
        status: {
            $ne: 2
        },
        role : 1
    }, cb);
}

/** INSERT USER IN USER COLLECTION */
userSchema.statics.insertNewUser = function(userObject,cb){    
    userObject.save((err,newUser)=>{        
        cb(err,newUser)    
    })
}

/** UPDATE USER DATA */
userSchema.statics.updateUser = function(userId,userData,cb){
    return this.findOneAndUpdate({
        _id : mongoose.Types.ObjectId(userId)        
    },userData,{
        new : true
    },cb)
}

/** CHECK FOR username/USER ALREADY EXISTS */
userSchema.statics.getUser =  function(id,cb){
    return this.aggregate([
     {
        $match:{
            _id : mongoose.Types.ObjectId(id),
            status: {
                $ne: 2
            },
            role : 2
        }
    },{
        $project: {
            username : 1 ,            
            firstName : 1,
            lastName : 1,
            role :1       
        }
    }],cb);
}


/** CHECK FOR username/USER ALREADY EXISTS */
userSchema.statics.getAdminUser =  function(id,cb){
    return this.aggregate([
     {
        $match:{
            _id : mongoose.Types.ObjectId(id),
            status: {
                $ne: 2
            },
            role : 1
        }
    },{
        $project: {
            username : 1 ,            
            firstName : 1,
            lastName : 1,
            role :1        
        }
    }],cb);
}

module.exports = mongoose.model('users', userSchema);