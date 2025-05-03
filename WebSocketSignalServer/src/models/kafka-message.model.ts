import {ISession} from "./session.model";
import {EKafkaMessageSendTypes} from "../enums/kafka-message-send-types.enum";

export interface IKafkaMessage {
    message: ISession;
    type: EKafkaMessageSendTypes;
}