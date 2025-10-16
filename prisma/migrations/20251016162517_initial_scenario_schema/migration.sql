-- CreateTable
CREATE TABLE "scenario_interaction_states" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scenarioId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "actionPerformed" TEXT NOT NULL,
    "elementInteracted" TEXT NOT NULL,
    "valueFilled" TEXT,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB
);

-- CreateIndex
CREATE INDEX "scenario_interaction_states_scenarioId_sessionId_idx" ON "scenario_interaction_states"("scenarioId", "sessionId");
