import asyncio
import terminator
import os

async def run_winforms_example():
    desktop = terminator.Desktop(log_level="trace")
    try:
        print("Opening WinForms Test App...")

        script_dir = os.path.dirname(os.path.abspath(__file__))
        app_path = os.path.join(script_dir, "../TestApplications/WinForms/bin/Release/WinFormsApplication.exe")

        print(f"Opening application at {app_path}")
        main_window = desktop.open_application(app_path)
 
        main_window.highlight()

        # locate the "Simple Controls" tab
        simple_controls_tab = main_window.locator('TabItem:Simple Controls')
        await simple_controls_tab.highlight()

        simple_controls_tabpage = await main_window.locator('Pane:Simple Controls').first()

        # locate the "Test TextBox" on the Simple Controls tab)

        print("Typing into Test TextBox...")
        await simple_controls_tabpage.locator('nativeid:TextBox').type_text("Hello from Terminator!")

        print("Interaction complete.")

    except terminator.PlatformError as e:
        print(f"Platform Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(run_winforms_example()) 