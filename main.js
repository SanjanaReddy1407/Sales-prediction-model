const form = document.getElementById("predict-form");
const sliders = {
  TV: document.getElementById("tv"),
  Radio: document.getElementById("radio"),
  Newspaper: document.getElementById("newspaper"),
};
const displays = {
  TV: document.getElementById("tv-display"),
  Radio: document.getElementById("radio-display"),
  Newspaper: document.getElementById("newspaper-display"),
};

function formatMoney(value) {
  return `$${Number(value).toFixed(2)}`;
}

function getInputs() {
  return {
    TV: parseFloat(sliders.TV.value),
    Radio: parseFloat(sliders.Radio.value),
    Newspaper: parseFloat(sliders.Newspaper.value),
  };
}

function updateDisplays() {
  const inputs = getInputs();
  displays.TV.textContent = inputs.TV.toFixed(1);
  displays.Radio.textContent = inputs.Radio.toFixed(1);
  displays.Newspaper.textContent = inputs.Newspaper.toFixed(1);

  const total = inputs.TV + inputs.Radio + inputs.Newspaper;
  document.getElementById("total-spend").textContent = formatMoney(total);
}

function setInputs(tv, radio, newspaper) {
  sliders.TV.value = tv;
  sliders.Radio.value = radio;
  sliders.Newspaper.value = newspaper;
  updateDisplays();
}

function updateResults(data) {
  document.getElementById("prediction-value").textContent = data.prediction.toFixed(2);

  const vsAvg = data.vs_average;
  const vsEl = document.getElementById("vs-average");
  vsEl.textContent = `${vsAvg >= 0 ? "+" : ""}${vsAvg.toFixed(2)} units`;
  vsEl.style.color = vsAvg >= 0 ? "#34d399" : "#f87171";

  document.getElementById("sales-per-dollar").textContent =
    `${data.sales_per_dollar.toFixed(3)} units/$`;

  const contributions = data.contributions;
  const maxContrib = Math.max(
    contributions.TV,
    contributions.Radio,
    contributions.Newspaper,
    1
  );

  ["TV", "Radio", "Newspaper"].forEach((channel) => {
    const key = channel.toLowerCase();
    const barId = channel === "Newspaper" ? "newspaper" : key;
    document.getElementById(`contrib-${barId}`).textContent = contributions[channel].toFixed(2);
    document.getElementById(`bar-${barId}`).style.width =
      `${(contributions[channel] / maxContrib) * 100}%`;
  });
}

async function predict() {
  const payload = getInputs();

  try {
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Prediction failed");
    }

    const data = await response.json();
    updateResults(data);
  } catch (error) {
    document.getElementById("prediction-value").textContent = "Error";
  }
}

Object.values(sliders).forEach((slider) => {
  slider.addEventListener("input", () => {
    updateDisplays();
    predict();
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  predict();
});

document.querySelectorAll(".preset-btn").forEach((button) => {
  button.addEventListener("click", () => {
    setInputs(
      parseFloat(button.dataset.tv),
      parseFloat(button.dataset.radio),
      parseFloat(button.dataset.newspaper)
    );
    predict();
  });
});

updateDisplays();
predict();
