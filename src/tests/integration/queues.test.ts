import { QueueUtils, QUEUE_NAMES } from '@/utils/QueueUtils';
import { EmailUtils } from '@/utils/EmailUtils';
import { EmailService } from '@/services/EmailService';
import emailProcessor from '@/workers/email.worker';

// Mock the EmailService to prevent actual emails from being sent
jest.mock('@/services/EmailService');

describe('Background Job Queues', () => {
  const emailQueue = QueueUtils.getQueue({
    queueName: QUEUE_NAMES.EMAIL
  });

  beforeAll(async () => {
    // Start processing the queue for the test
    emailQueue.process(emailProcessor);
  });

  afterEach(async () => {
    // Clear any mocks after each test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up the queue and close connections
    await emailQueue.empty();
    await emailQueue.close();
  });

  it('should add an email job to the queue and process it', async () => {
    const to = 'test@example.com';
    const verificationLink = 'http://example.com/verify';

    // Spy on the mocked EmailService to check if it gets called
    const sendEmailSpy = jest.spyOn(EmailService, 'sendEmail');

    // Dispatch the email job
    await EmailUtils.sendVerificationEmail(to, verificationLink);

    // Wait for the job to be processed
    await new Promise(resolve => emailQueue.on('completed', resolve));

    // Assertions
    expect(sendEmailSpy).toHaveBeenCalledTimes(1);
    expect(sendEmailSpy).toHaveBeenCalledWith({
      to,
      subject: 'Verify Your Email Address',
      html: expect.any(String),
    });
  });
});
