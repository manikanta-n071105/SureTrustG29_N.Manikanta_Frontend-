import React from "react";


const apiUrl= "http://localhost:5000/api/otp/otp"
const ProfileCard: React.FC = () => {
  const [email,setEmail]=React.useState("")
  const [otpSent,setOtpSent]=React.useState(false)
  const handleSendOtp=async()=>{
    try {
      const res = await fetch(apiUrl,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({email})
      })
      const data = await res.json();
      setOtpSent(true);
      console.log(data);
    } catch (error) {
      console.log("Error sending OTP:", error);
    }

  }



  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-xl p-5 border">
      <h3
     className="text-bold"
     >Reset Password</h3>
   {otpSent?
    <>
      <h5
      className="align-center mb-3"
      >Check your email</h5>
       <div className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter The OTP"
          className="w-full border p-2 rounded mb-3"
          // onChange={(e)=>setEmail(e.target.value)}
        />
          <input
          type="text"
          placeholder="Enter New Password"
          className="w-full border p-2 rounded mb-3"
          // onChange={(e)=>setEmail(e.target.value)}
        />
          <input
          type="text"
          placeholder="Confirm Password"
          className="w-full border p-2 rounded mb-3"
          // onChange={(e)=>setEmail(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded mb-3"
        // onClick={handleSendOtp}
        >
        Change Password
        </button>
      </div>
      
      </>:
   <>
      <div className="flex flex-col items-center">
        <input
          type="email"
          placeholder="Enter Your registered Email"
          className="w-full border p-2 rounded mb-3"
          onChange={(e)=>setEmail(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded mb-3"
        onClick={handleSendOtp}
        >
         SEND OtP
        </button>
      </div>
      </>
      
     }
    </div>
  );
};

export default ProfileCard;


