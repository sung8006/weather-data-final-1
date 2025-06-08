import express from "express";
import request from "request";
import { Request, Response } from "express";

const app = express();

app.get("/weather", (req: Request, res: Response) => {
  const { serviceKey, numOfRows = "10", pageNo = "1" } = req.query;

  const now = new Date();
  now.setHours(now.getHours() - 1);
  const base_date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const base_time = now.getHours().toString().padStart(2, "0") + "00";

  const nx = 60;  // 평택 서정동
  const ny = 127;

  const api_url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
  const options = {
    url: api_url,
    qs: {
      serviceKey: serviceKey as string,
      numOfRows,
      pageNo,
      base_date,
      base_time,
      nx,
      ny,
      dataType: "XML",
    },
  };

  request.get(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.setHeader("Content-Type", "application/xml;charset=utf-8");
      res.send(body);
    } else {
      res.status(response?.statusCode || 500).send("오류 발생");
      console.error("❌ 에러:", error || response?.statusCode);
    }
  });
});

app.listen(3000, () => {
  console.log("✅ 서버 실행됨: http://localhost:3000/weather?serviceKey=JbcTKpI%2BOiV%2BSTSRjAS16syKEn%2F21%2B%2F8fo1XW3J3BF6yGeGrYEmk7MIFx4fx3z1PTgqZOmw72YsPOqxq1girvw%3D%3D&numOfRows=10&pageNo=1");
});
