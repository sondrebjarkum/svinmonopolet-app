import yargs from 'yargs';
const TestSchedService = {
  perform: () => Promise<unknown>,
};

// RUN WITH: npx ts-node admin-invoke.ts test-sched-service

// Define a custom command called "test-sched-service"
yargs.command({
  command: 'test-sched-service',
  describe: 'Invoke schedualed test service',
  handler(argv: any) {
    TestSchedService.perform()
      .then(() => console.log('TestSchedService Performed...'))
      .catch((err: Error) => console.error('TestSchedService failed', err.message));
  },
});

// Parse the command-line arguments and execute the corresponding command
// eslint-disable-next-line @typescript-eslint/no-floating-promises
yargs.parse();
