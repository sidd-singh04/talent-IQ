import http from "http";

const TOTAL_REQUESTS = 1000;
const CONCURRENT = 20;
const URL = "http://127.0.0.1:3000/api/sessions/test-active";

let completed = 0;
let errors = 0;
let totalTime = 0;
let active = 0;

function makeRequest() {
  if (completed + active >= TOTAL_REQUESTS) return;

  active++;
  const start = Date.now();

  http.get(URL, (res) => {
    res.on("data", () => {});
    res.on("end", () => {
      const duration = Date.now() - start;
      totalTime += duration;
      completed++;
      active--;

      if (completed < TOTAL_REQUESTS) {
        makeRequest(); // maintain concurrency
      } else if (completed === TOTAL_REQUESTS) {
        console.log("Total Requests:", TOTAL_REQUESTS);
        console.log("Errors:", errors);
        console.log(
          "Average Latency:",
          (totalTime / TOTAL_REQUESTS).toFixed(2),
          "ms"
        );
      }
    });
  }).on("error", () => {
    errors++;
    active--;
  });
}

// start initial concurrent batch
for (let i = 0; i < CONCURRENT; i++) {
  makeRequest();
}