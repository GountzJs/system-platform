export const sanitizeMessage = (message: string) => {
  return message.replace(/^[./\\]/, ' $&');
};
