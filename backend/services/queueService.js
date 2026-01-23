import amqp from 'amqplib';

class QueueService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queues = {
      NOTIFICATIONS: 'notifications',
      REPORTS: 'reports',
      EMAILS: 'emails'
    };
  }

  /**
   * Connect to RabbitMQ
   */
  async connect() {
    try {
      const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672';
      
      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      // Assert queues exist
      await Promise.all(
        Object.values(this.queues).map((queue) =>
          this.channel.assertQueue(queue, { durable: true })
        )
      );

      console.log('✅ RabbitMQ connected successfully');

      // Handle connection errors
      this.connection.on('error', (err) => {
        console.error('❌ RabbitMQ connection error:', err);
      });

      this.connection.on('close', () => {
        console.log('⚠️  RabbitMQ connection closed');
      });

      // Start consumers
      this.startConsumers();

      return true;
    } catch (error) {
      console.error('❌ RabbitMQ connection failed:', error.message);
      // Don't throw error - app should work without RabbitMQ
      return false;
    }
  }

  /**
   * Send message to queue
   * @param {String} queue - Queue name
   * @param {Object} message - Message to send
   */
  async sendToQueue(queue, message) {
    try {
      if (!this.channel) {
        console.warn('⚠️  RabbitMQ not connected, skipping message');
        return false;
      }

      const messageBuffer = Buffer.from(JSON.stringify(message));
      this.channel.sendToQueue(queue, messageBuffer, { persistent: true });
      
      return true;
    } catch (error) {
      console.error('❌ Failed to send message to queue:', error);
      return false;
    }
  }

  /**
   * Send notification (new review, new favorite, etc.)
   * @param {Object} notificationData - Notification data
   */
  async sendNotification(notificationData) {
    return await this.sendToQueue(this.queues.NOTIFICATIONS, {
      ...notificationData,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Generate report (admin analytics)
   * @param {Object} reportData - Report parameters
   */
  async generateReport(reportData) {
    return await this.sendToQueue(this.queues.REPORTS, {
      ...reportData,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send email (welcome, password reset, etc.)
   * @param {Object} emailData - Email data
   */
  async sendEmail(emailData) {
    return await this.sendToQueue(this.queues.EMAILS, {
      ...emailData,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Start consumers for all queues
   */
  startConsumers() {
    if (!this.channel) return;

    // Notifications consumer
    this.channel.consume(
      this.queues.NOTIFICATIONS,
      (msg) => {
        if (msg) {
          const notification = JSON.parse(msg.content.toString());
          this.handleNotification(notification);
          this.channel.ack(msg);
        }
      },
      { noAck: false }
    );

    // Reports consumer
    this.channel.consume(
      this.queues.REPORTS,
      (msg) => {
        if (msg) {
          const report = JSON.parse(msg.content.toString());
          this.handleReport(report);
          this.channel.ack(msg);
        }
      },
      { noAck: false }
    );

    // Emails consumer
    this.channel.consume(
      this.queues.EMAILS,
      (msg) => {
        if (msg) {
          const email = JSON.parse(msg.content.toString());
          this.handleEmail(email);
          this.channel.ack(msg);
        }
      },
      { noAck: false }
    );

    console.log('👂 RabbitMQ consumers started');
  }

  /**
   * Handle notification processing
   * @param {Object} notification - Notification data
   */
  handleNotification(notification) {
    console.log('📬 Processing notification:', notification.type);
    
    // In production, this would:
    // - Save to notifications collection
    // - Send push notification
    // - Send WebSocket message
    
    switch (notification.type) {
      case 'new_review':
        console.log(`  → New review for drink ${notification.drinkId} with rating ${notification.rating}`);
        break;
      case 'new_favorite':
        console.log(`  → Drink ${notification.drinkId} was favorited`);
        break;
      default:
        console.log(`  → Unknown notification type: ${notification.type}`);
    }
  }

  /**
   * Handle report generation
   * @param {Object} report - Report data
   */
  handleReport(report) {
    console.log('📊 Generating report:', report.type);
    
    // In production, this would:
    // - Generate PDF/CSV report
    // - Save to storage
    // - Send email with attachment
    
    console.log(`  → Report parameters:`, report);
  }

  /**
   * Handle email sending
   * @param {Object} email - Email data
   */
  handleEmail(email) {
    console.log('📧 Sending email:', email.type);
    
    // In production, this would:
    // - Use email service (SendGrid, AWS SES, etc.)
    // - Send actual email
    
    console.log(`  → To: ${email.to}`);
    console.log(`  → Subject: ${email.subject}`);
  }

  /**
   * Close connection
   */
  async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('🔌 RabbitMQ connection closed');
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }

  /**
   * Get queue stats
   */
  async getQueueStats() {
    if (!this.channel) {
      return { error: 'RabbitMQ not connected' };
    }

    const stats = {};
    
    for (const [name, queue] of Object.entries(this.queues)) {
      try {
        const queueInfo = await this.channel.checkQueue(queue);
        stats[name] = {
          messageCount: queueInfo.messageCount,
          consumerCount: queueInfo.consumerCount
        };
      } catch (error) {
        stats[name] = { error: error.message };
      }
    }

    return stats;
  }
}

export default new QueueService();
