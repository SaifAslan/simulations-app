describe('suite name', () => {
  it('foo', () => {
    expect(Math.sqrt(4)).toBe(2);
  });

  it('bar', () => {
    expect(1 + 1).toBe(2);
  });

  it('snapshot', () => {
    expect({ foo: 'bar' }).toMatchSnapshot();
  });
});
