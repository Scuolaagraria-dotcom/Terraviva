const URL="https://teachablemachine.withgoogle.com/models/LIY6s69qI/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    webcam = new tmImage.Webcam(300, 300, true);
    await webcam.setup();
    await webcam.play();

    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
}

async function loop() {

    webcam.update();

    await predict();

    setTimeout(() => {
        window.requestAnimationFrame(loop);
    }, 4000);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);

    let highestPrediction = prediction[0];

    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > highestPrediction.probability) {
            highestPrediction = prediction[i];
        }
    }

    labelContainer.innerHTML =
        highestPrediction.className +
        " (" +
        (highestPrediction.probability * 100).toFixed(1) +
        "%)";

    const feedback = document.getElementById("feedback");

    // Convertiamo il nome in minuscolo così non importa se l'hai scritto con la maiuscola o minuscola su Teachable Machine
    const classNameMinuscolo = highestPrediction.className.toLowerCase();

    if (classNameMinuscolo.includes("sana")) {
        feedback.innerHTML = "🌱 La pianta sembra sana. Continuare con irrigazione equilibrata e coltivazione sostenibile.";
    } else {
        feedback.innerHTML = "⚠️ Possibile stress della pianta. Controllare acqua, terreno e ridurre uso di pesticidi.";
    }
}
