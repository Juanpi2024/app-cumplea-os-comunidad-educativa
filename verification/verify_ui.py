from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_birthday_app(page: Page):
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

    # 1. Open the docs/index.html file (Preview Mode)
    page.goto("file:///app/docs/index.html")

    # 2. Wait for data to load (Total count should be visible)
    # The mock data in Index.html has 3 records
    expect(page.locator("#kTotal")).not_to_have_text("—")
    expect(page.locator("#kTotal")).to_have_text("3")

    # 3. Verify festive elements
    expect(page.locator("h1")).to_contain_text("Cumpleaños CEIA")

    # 3.1 Verify Preview Mode Banner
    expect(page.locator("text=Modo Vista Previa")).to_be_visible()

    # 4. Verify Today's birthday is shown in Banner
    # Note: Confetti might affect visibility checks if overlaying, but usually standard visibility checks pass.
    # The banner is hidden by default and removed 'hidden' class by JS.
    expect(page.locator("#bannerHoy")).to_be_visible()
    expect(page.locator("#textoFelicitacion")).to_contain_text("Juan Perez (Ejemplo)")

    # 5. Open Modal
    # Click on the "Saludar" button (👋 icon) for Juan Perez
    # We find the list item containing Juan Perez, then find the button with title "Enviar Mensaje"
    # Using 'Juan Perez (Ejemplo)'
    greet_btn = page.locator("#listMes li").filter(has_text="Juan Perez (Ejemplo)").get_by_title("Enviar Mensaje")
    greet_btn.click()

    # 6. Verify Modal is visible
    modal = page.locator("#modalSaludar")
    expect(modal).to_be_visible()
    expect(page.locator("#modalName")).to_have_text("Juan Perez (Ejemplo)")
    expect(page.locator("#modalMessage")).to_be_visible()

    # 7. Take screenshot
    time.sleep(1) # Allow animations/confetti to render
    print("Taking screenshot...")
    page.screenshot(path="/home/jules/verification/verification.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_birthday_app(page)
        finally:
            browser.close()
