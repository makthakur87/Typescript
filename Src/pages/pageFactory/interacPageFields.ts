import { fillAccountNickname, fillPassword, fillRecipientName, fillToken, getProfileType } from "@config/reusable_functions/customHandlers";
import { createRecipientLocators } from "./createRecipientLocators";
import { getValueByPath, normalizeRadioValue } from "@config/reusable_functions/fieldFillers";

export const page1Fields = {
  "testdata.createRecipient.profileInformation.profileType": {
    type: "custom",
    handler: getProfileType,
    required: true,
  },
  profileName: {
    type: "text",
    selector: createRecipientLocators.sProfileName,
    required: true,
  },
  "testdata.createRecipient.profileInformation.profileEmail": {
    type: "text",
    selector: createRecipientLocators.profileEmail
  },
  "testdata.createRecipient.profileInformation.profilePhoneNumber": {
    type: "text",
    selector: createRecipientLocators.profilePhoneNumber
  },
  "testdata.createRecipient.profileInformation.addServiceGroup": {
    type: "radio",
    selectors: {
      Yes: createRecipientLocators.profileSgYesButton,
      No: createRecipientLocators.profileSgNoButton
    },
    visibleWhen: (data: any) => data.isEnhancedCustomer === "true"
  },
  "testdata.createRecipient.profileInformation.profileServiceGroup": {
    type: "dropdown",
    selector: createRecipientLocators.profileServiceGroup,
    when: (data: any) => data.isEnhancedCustomer === "true" && 
    normalizeRadioValue(getValueByPath(data,"testdata.createRecipient.profileInformation.addServiceGroup")) === "Yes",
    required: true,
  },
  continueButton_1: {
    type: "button",
    selector: createRecipientLocators.profileContinueButton
  }
};

export const page2Fields = {
  "currentRecipient.paymentDestination": {
    type: "dropdown",
    selector: createRecipientLocators.recipinentDestination,
    required: true,
  },
  "currentRecipient.paymentType": {
    type: "dropdown",
    selector: createRecipientLocators.paymentType,
    required: true,
  },
  "currentRecipient.fundTransferType": {
    type: "radio",
    selectors: {
      EMAIL: createRecipientLocators.fundTransferEmail,
      ANN: createRecipientLocators.fundTransferAccountNumber,
      BOTH: createRecipientLocators.fundTransferBoth,
    },
    required: true,
  },
   "currentRecipient.bankDetails.bankInstitution": {
    type: "dropdown",
    selector: createRecipientLocators.bankInstitutionNumber,
    visibleWhen: (data: any) => {
      return data.currentRecipient.fundTransferType === "ANN" || 
      data.currentRecipient.fundTransferType === "BOTH"; 
    },
    required: true
  },
  "currentRecipient.bankDetails.transitNumber": {
    type: "text",
    selector: createRecipientLocators.bankTransitNumber,
    visibleWhen: (data: any) => {
      return data.currentRecipient.fundTransferType === "ANN" || 
      data.currentRecipient.fundTransferType === "BOTH";
    },
    required: true
  },
  "currentRecipient.bankDetails.accountNumber": {
    type: "text",
    selector: createRecipientLocators.bankAccountNumber,
    visibleWhen: (data: any) => 
        data.currentRecipient.fundTransferType === "ANN" || 
        data.currentRecipient.fundTransferType === "BOTH",
    required: true
  },
  recipientName: {
    type: "custom",
    handler: fillRecipientName,
    required: true
  },
  "currentRecipient.recipientAddress.recipientEmailAddress": {
    type: "text",
    selector: createRecipientLocators.recipientEmail,
    visibleWhen: (data: any) =>
        data.currentRecipient.fundTransferType === "EMAIL" ||
        data.currentRecipient.fundTransferType === "BOTH",
    required: true
  },
   "currentRecipient.recipientAddress.notificationEmailAddress": {
    type: "text",
    selector: createRecipientLocators.recipientNotificationEmail,
    visibleWhen: (data: any) => data.currentRecipient.fundTransferType === "ANN",
  },
  "currentRecipient.recipientAddress.notificationLanguage": {
    type: "dropdown",
    selector: createRecipientLocators.recipientNotificationLanguage,
  },
  accountNickName: {
    type: "custom",
    handler: fillAccountNickname,
    required: true
  },
  password: {
    type: "custom",
    handler: fillPassword,
    required: true,
  },
  token: {
    type: "custom",
    handler: fillToken,
    required: true,
  },
  continueButton_2: {
    type: "button",
    selector: createRecipientLocators.recipientContinueButton
  }
};