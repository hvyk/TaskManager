const { calculateTip, add } = require('./sample')

test('Hello World!', () => {

});

// test('This should fail', () => {
//   throw new Error('Failure!!');
// })

test('Calculate tip', () => {
  const total = calculateTip(10, 2);
  expect(total).toBe(10.2);
});


test('Async test demo', (done) => {
  setTimeout(() => {
    expect(1).toBe(1);
    done(); // needed
  }, 1);
})

test('Async Promise add', (done) => {
  add(2,3).then((sum) => {
    expect(sum).toBe(5);
    done();
  })
});

test('Async/await add', async () => {
  const sum = await add(20, 12);
  expect(sum).toBe(32);
})