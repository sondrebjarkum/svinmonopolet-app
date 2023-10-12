```
This project is a work in progress and unstable - use it with extreme prejudice
```

# Svinmonopolet
### What does it do?
Lists all of Vinmonopolet's beers, meads and non-alcoholics with Untappd-score sorted by stores. Comes with a client front-end!

### How does it do it?
The server retrieves a list of beverages, stores and their stock from Vinmonopolet, cross-referencing them with Untappd to incorporate their ratings using scheduled tasks, and subsequently updates the database with the compiled results.

## Client
### Development
Start the T3 client app in development mode
```bash
npm run dev
```

## Server
### Running the app
Following commands can be used to run the app:

### Invoker
Initiates the CLI, enabling you to trigger tasks/jobs and perform some analyses.
In your terminal, execute the script below, then input <kbd>i</kbd> followed by pressing <kbd>enter</kbd>.
```
npm run dev:invoker
```
### Routine
Runs the app as it would in production, starting the scheduled jobs at given time intervals.
```
npm run dev:routine
```

### Notes
As Untappd no longer provides any new API-keys, you most likely wont be able to run this application.

