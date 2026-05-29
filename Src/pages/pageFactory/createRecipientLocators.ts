import { profile } from "node:console";

export const createRecipientLocators = {
    profileTypeBusiness: 'input[name="profileType"][value="business"]',
    profileTypeIndividual: 'input[name="profileType"][value="individual"]',
    profileServiceGroup: 'input[name="profileServiceGroup"]',
    sProfileName: 'input[name="profileName"]',
    profileEmail: 'input[name="profileEmail"]',
    profilePhoneNumber: 'input[name="profilePhoneNumber"]',
    profileSgYesButton: 'input[name="profileSg"][value="yes"]',
    profileSgNoButton: 'input[name="profileSg"][value="no"]',
    profileServiceGroupDropdown: 'select[name="profileServiceGroup"]',
    profileContinueButton: 'button[name="profileContinueButton"]',

    recipinentDestination: 'select[name="paymentDestination"]',
    paymentType: 'select[name="paymentType"]',

    fundTransferEmail: 'input[name="fundTransferEmail"]',
    fundTransferAccountNumber: 'input[name="fundTransferAccountNumber"]',
    fundTransferBoth: 'input[name="fundTransferBoth"]',

    bankInstitutionNumber: 'input[name="bankInstitutionNumber"]',
    bankTransitNumber: 'input[name="bankTransitNumber"]',
    bankAccountNumber: 'input[name="bankAccountNumber"]',

    recipientName: 'input[name="recipientName"]',
    recipientEmail: 'input[name="recipientEmail"]',
    recipientNotificationEmail: 'input[name="recipientNotificationEmail"]',
    recipientNotificationLanguage: 'select[name="recipientNotificationLanguage"]',
    recipientAccountNickname: 'input[name="recipientAccountNickname"]',

    userPassword: 'input[name="userPassword"]',
    tokenValue: 'input[name="tokenValue"]',

    recipientContinueButton: 'button[name="recipientContinueButton"]',

    recipientCreationMessage: "#id",
    addAnotherRecipient: 'button[name="addAnotherRecipient"]'
}