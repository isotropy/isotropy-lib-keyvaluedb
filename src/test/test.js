const should = require("should");
import * as dbLib from "../isotropy-lib-keyvaluedb";

describe("lib-db", function() {
  beforeEach(() => {
    dbLib.flushdb();
  });

  it("put", async () => {
    const beforeInsert = await dbLib.exists("", "task");
    await dbLib.put("", { task: "testTask" });
    const afterInsert = await dbLib.exists("", "task");
    beforeInsert.should.equal(0) && afterInsert.should.equal(1);
  });

  it("get", async () => {
    await dbLib.put("", { task: "testTask" });
    const result = await dbLib.get("", "task");
    result.should.equal("testTask");
  });

  it("del", async () => {
    await dbLib.put("", { task: "testTask" });
    const afterInsert = await dbLib.exists("", "task");
    await dbLib.del("", "task");
    const afterDelete = await dbLib.exists("", "task");
    afterInsert.should.equal(1) && afterDelete.should.equal(0);
  });

  it("scan", async () => {
    await dbLib.put("", { Get_Eggs: "Get liek 2" });
    const dbPairs = await dbLib.scan("");
    dbPairs.should.deepEqual(["0", ["Get_Eggs"]]);
  });
});
