from diagrams import Diagram, Cluster, Edge
from diagrams.custom import Custom
from diagrams.aws.general import User
from diagrams.generic.storage import Storage

ICON_PATH = "./"
JS_ICON = ICON_PATH + "js.png"
HTML_ICON = ICON_PATH + "html.jpeg"
CSS_ICON = ICON_PATH + "css.png"
GEMINI_ICON = ICON_PATH + "gem.png"
BROWSER_ICON = ICON_PATH + "browser.png"
with Diagram("Uzu Architecture", show=False, direction="LR"):
    user = User("User\n(Inputs case name\n& API key)")
    with Cluster("Browser Extension (Uzu)"):
        browser = Custom("Browser", BROWSER_ICON)
        with Cluster("Extension Files"):
            popup_html = Custom("popup.html\n(UI Structure)", HTML_ICON)
            styles_css = Custom("\nstyles.css\n(Styling)", CSS_ICON)
            popup_js = Custom("popup.js\n(UI Logic)", JS_ICON)
            background_js = Custom("background.js\n(API Handler)", JS_ICON)
            storage = Storage("Browser Local Storage")
            popup_html >> Edge() << styles_css
            popup_html >> Edge() << popup_js
            popup_js >> Edge() << storage
            popup_js >> Edge() << background_js
    gemini_api = Custom("Gemini API", GEMINI_ICON)
    user >> Edge(label="1. Input case name") >> browser
    browser >> Edge(label="2. Loads UI") >> popup_html
    background_js >> Edge(label="3. Fetch API key") >> storage
    background_js >> Edge(label="4. Forward request") >> gemini_api
    gemini_api >> Edge(label="5. JSON Response", color="purple") >> background_js
    background_js >> Edge(label="6. Process data") >> popup_js
    popup_js >> Edge(label="7. Render output") >> browser
    browser >> Edge(label="8. Display result", color="blue") >> user

print("Diagram generated as uzu_architecture.png")