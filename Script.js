const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".img-gallery");


const OPENAI_API_KEY = "sk-proj-YCospJWHG6Xx9E7M190kT3BlbkFJKtM3ScO66R9NhLFu5f1T";

const updateImageCard = (imgDataArray) =>{
    imgDataArray.forEach((imgObject,index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");
        //Set the image sources to the Ai-Gnerated Image Data
        const aiGeneratedImg = `data:images/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () =>{
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href",aiGeneratedImg);
            downloadBtn.setAttribute("download",`${new Date().getTime()}.jpg`);
        }
    });

}


const generateAiImages = async(userPrompt,userImgQuantity) =>{
    try{

        //send a request to openai to gneenrate images based on userinput
         const response = await fetch("https://api.openai.com/v1/images/generations",
           {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${OPENAI_API_KEY}`,
             },
             body: JSON.stringify({
               prompt: userPrompt,
               n: parseInt(userImgQuantity),
               size: "512x512",
               response_format: "b64_json",
             }),
           }
         );

                if(!response.ok)throw new Error ("Failed to Genenrate images ! Please Try Again");
                const {data} = await response.json(); // get data from response
                updateImageCard([...data]);
    }
    catch(error){
        console.log(error.message);
    }
}
const handleFormSubmission = (e) =>{
    e.preventDefault();

    //input user
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;
     

    const imgCardMarkup = Array.from({length:userImgQuantity}, () => 
    `
         <div class="img-card loading">
        <img src="images/loader.svg" alt="image">
        <a href="#" class="download-btn">
            <img src="download.png" alt="download icon">
         
        </a>
    </div>`
    
    
    ).join('');
   
    imageGallery.innerHTML = imgCardMarkup; 
    generateAiImages(userPrompt,userImgQuantity);

}

generateForm.addEventListener("submit" , handleFormSubmission);
