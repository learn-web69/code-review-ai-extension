# AI Core Review Assistant

This project is an AI-powered assistant to generate code review walkthroughs for GitHub Pull Requests. It is set up to run as both a web-based mock for development and as a fully functional Chrome extension.

## Project Setup

1.  **Install Dependencies**:
    Make sure you have Node.js and npm installed. Then, run the following command in the project root:
    ```bash
    npm install
    ```

## Development (Web Mock)

To run the application in a local development server with hot-reloading, use the following command. This is useful for rapid UI development and testing.

```bash
npm run dev
```
This will start a server, typically at `http://localhost:5173`.

## Building the Application

There are two build targets: one for the web preview and one for the Chrome extension.

### 1. Build for Web

This command compiles the application into a static site in the `dist` directory. You can deploy this folder to any static hosting service.

```bash
npm run build:web
```

### 2. Build for Chrome Extension

This command compiles the application into the `dist-ext` directory, formatted specifically to be loaded as a Chrome extension.

```bash
npm run build:ext
```

### Loading the Chrome Extension

1.  After running `npm run build:ext`, you will have a `dist-ext` folder.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable "Developer mode" in the top-right corner.
4.  Click on "Load unpacked".
5.  Select the `dist-ext` directory from this project.
6.  The "AI Core Review Assistant" extension should now appear in your list of extensions. Navigate to a GitHub Pull Request page to use it.
