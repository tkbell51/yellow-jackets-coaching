import { expect, test } from "@playwright/test";

test("coach can sign in, use roster, attendance, practice, and competition flows", async ({ page, context }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("link", { name: "Start Practice" })).toBeVisible();

  await page.getByRole("link", { name: "Team" }).click();
  await expect(page.getByRole("heading", { name: "Roster" })).toBeVisible();
  await page.getByRole("button", { name: /Add Player/ }).click();
  await page.getByLabel("First name").fill("Quincy");
  await page.getByLabel("Last name").fill("Stone");
  await page.getByLabel("Jersey number").fill("88");
  await page.getByLabel("Primary offense").fill("WR");
  await page.getByLabel("Primary defense").fill("CB");
  await page.getByRole("button", { name: "Save Player" }).click();
  await expect(page.getByText("Quincy Stone")).toBeVisible();

  await page.getByRole("link", { name: "Practice" }).click();
  await page.getByRole("button", { name: "present" }).first().click();
  await page.getByRole("link", { name: "Start Practice" }).first().click();
  await expect(page.getByText("Sideline Mode")).toBeVisible();
  await page.getByRole("button", { name: /Next/ }).click();
  await expect(page.getByText("Period 2 of 7")).toBeVisible();

  await page.getByRole("link", { name: /Award Points/ }).click();
  await page.getByRole("button", { name: "8U" }).click();
  await page.getByRole("button", { name: "Effort" }).first().click();
  await expect(page.getByText("8U Gold +1 for Effort")).toBeVisible();
  await page.getByRole("button", { name: "10U" }).click();
  await page.getByRole("button", { name: "Toughness" }).nth(1).click();
  await expect(page.getByText("10U Black +1 for Toughness")).toBeVisible();
  await page.getByRole("button", { name: /Undo/ }).click();
  await expect(page.getByText(/Undid 10U Black/)).toBeVisible();

  await context.setOffline(true);
  await page.getByRole("button", { name: "Attitude" }).first().click();
  await expect(page.getByRole("button", { name: /Offline|Pending/ }).first()).toBeVisible();
  await context.setOffline(false);
});
