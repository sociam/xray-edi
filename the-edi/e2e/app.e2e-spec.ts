import { TheEdiPage } from './app.po';

describe('the-edi App', () => {
  let page: TheEdiPage;

  beforeEach(() => {
    page = new TheEdiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
