import { Kafka, type Message, Producer, Consumer } from 'kafkajs';

export default class KafkaConfig {
  public static topicName: string;

  private static kafka: Kafka;
  private static producer: Producer;
  private static consumer: Consumer;

  static init = async (topic: string) => {
    KafkaConfig.topicName = topic;

    KafkaConfig.kafka = new Kafka({
      clientId: 'kafka-demo',
      brokers: ['localhost:9092'],
    });

    KafkaConfig.producer = KafkaConfig.kafka.producer();
    KafkaConfig.consumer = KafkaConfig.kafka.consumer({ groupId: 'chat-group-2' });

    console.log('kafka initialized');
  };

  static sendMessage = async (topic: string, messages: Message[]) => {
    try {
      await KafkaConfig.producer.connect();

      return await KafkaConfig.producer.send({
        topic,
        messages,
      });
    } catch (error) {
      console.error(error);
    } finally {
      await KafkaConfig.producer.disconnect();
    }
  };

  static receiveMessage = async (topic: string, cb: Function) => {
    try {
      await KafkaConfig.consumer.connect();
      await KafkaConfig.consumer.subscribe({
        topic,
        fromBeginning: true,
      });

      await KafkaConfig.consumer.run({
        eachMessage: async ({ message }) => {
          const value: KafkaConfig = {
            key: message.key.toString(),
            message: message.value.toString(),
          };
          cb(value);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
}
