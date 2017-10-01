const should = require("should");
import * as dbLib from "../isotropy-lib-keyvaluedb";

describe("lib-db", function() {
  beforeEach(() => {
    dbLib.flushdb();
  });

  it("put", async () => {
    const beforeInsert = await dbLib.exists("", "task");
    await dbLib.put("", { key: "task", value: "testTask" });
    const afterInsert = await dbLib.exists("", "task");
    beforeInsert.should.equal(0) && afterInsert.should.equal(1);
  });

  it("put-hash", async () => {
    const beforeInsert = await dbLib.exists("", "task");
    await dbLib.put("", {
      key: "task",
      value: { type: "task", method: "just do it" }
    });
    const afterInsert = await dbLib.exists("", "task");
    const afterInsertData = await dbLib.hget("", "task", "method");

    beforeInsert.should.equal(0) &&
      afterInsert.should.equal(1) &&
      afterInsertData.should.equal("just do it");
  });

  it("put-set", async () => {
    const beforeInsert = await dbLib.exists("", "task");
    await dbLib.put("", {
      key: "task",
      value: ["Get Eggs", "Get Milk", "A wheel of cheese"]
    });
    const afterInsert = await dbLib.exists("", "task");
    const afterInsertData = await dbLib.sget("", "task");

    beforeInsert.should.equal(0) &&
      afterInsert.should.equal(1) &&
      afterInsertData.should.deepEqual([
        "Get Milk",
        "A wheel of cheese",
        "Get Eggs"
      ]);
  });

  it("get", async () => {
    await dbLib.put("", { key: "task", value: "testTask" });
    const result = await dbLib.get("", "task");
    result.should.equal("testTask");
  });

  it("del", async () => {
    await dbLib.put("", { key: "task", value: "testTask" });
    const afterInsert = await dbLib.exists("", "task");
    await dbLib.del("", "task");
    const afterDelete = await dbLib.exists("", "task");
    afterInsert.should.equal(1) && afterDelete.should.equal(0);
  });

  it("scan", async () => {
    await dbLib.put("", { key: "Get_Eggs", value: "Get liek 2" });
    const dbPairs = await dbLib.scan("");
    dbPairs.should.deepEqual(["0", ["Get_Eggs"]]);
  });
});
