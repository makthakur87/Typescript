import fs from "fs";
import { EnvLoader } from "@config/loaders/envLoader";
import { JsonUtils } from "@config/utils/JsonUtils";
import { PaymentConstants } from "@config/common/paymentConstant";
import { RecipientManager } from "@config/utils/CommonFunctions";

export class RecipientUtils {
    // In-memory map to store recipient data during test execution
    private static recipientMap: Record<string, string> = {};
    /**
     * Create a unique string for a recipient based on the input data map.
     * 
     * @param inputDataMap      The input data map containing recipient information.
     * @returns                 A unique string representing the recipient.
     * 
     * @author:                 Mandeep Kumar
     */
    async createUniqueRecipientString(inputDataMap: Record<string, any>) {
    const uniqueKeys = new Set(Object.keys(inputDataMap));
    uniqueKeys.add("customerID");

    return Object.entries(inputDataMap)
        .filter(([key]) => uniqueKeys.has(key))
        .map(([_, value]) => String(value))
        .join(", ");
    }

     // -----------------------------
    // Recipient Map (ThreadLocal equivalent)
    // -----------------------------
    // static getRecipientMap(): Map<string, string> | null {
    //     return this.recipientMap;
    // }

    // static setRecipientMap(map: Map<string, string>) {
    //     this.recipientMap = map;
    // }

    // static addRecipientDataInRecipientMap(uniqueRecipientString: string, recipientName: string) {
    //     let map = this.getRecipientMap();

    //     if (!map) {
    //         console.log("recipient Map created");
    //         map = new Map<string, string>();
    //         this.setRecipientMap(map);
    //     }

    //     map.set(uniqueRecipientString, recipientName);
    // }

    // static getRecipientFromRecipientMap(uniqueRecipientString: string): string | null {
    //     let map = this.getRecipientMap();

    //     if (!map) {
    //         console.log("recipient Map did not exist and is created");
    //         map = new Map<string, string>();
    //         this.setRecipientMap(map);
    //         return null;
    //     }

    //     return map.get(uniqueRecipientString) || null;
    // }


    static addRecipientDataInCache(key: string, value: string) {
        this.recipientMap[key] = value;
    }

    static getRecipientDataFromCache(key: string): string | undefined | null {
        return this.recipientMap[key];
    }


    // update unique data in input map based on existing profile name (for both JSON and in-memory scenarios)
  async updateUniqueData(inputDataMap: any, randomUniqueNumber: string) {
    // PROFILE NAME
    let profileName = JsonUtils.getStringValue(inputDataMap, "createRecipient.profileInformation.profileName") || "";

    if (profileName.length > 0) {
      if (profileName.length >= PaymentConstants.PROFILE_NAME_MAX_LENGTH) {
        profileName = profileName.substring(0, PaymentConstants.PROFILE_NAME_MAX_LENGTH - randomUniqueNumber.length) + randomUniqueNumber;
      } else {
        profileName += randomUniqueNumber;
        if (profileName.length > PaymentConstants.PROFILE_NAME_MAX_LENGTH) {
          profileName = profileName.substring(0, PaymentConstants.PROFILE_NAME_MAX_LENGTH);
        }
      }
    }
    inputDataMap.profileName = profileName;

    // RECIPIENT NAME
    let recipientName = JsonUtils.getStringValue(inputDataMap, "createRecipient.recipientName") || "";

    if (recipientName.length > 0) {
      if (recipientName.length >= PaymentConstants.RECIPIENT_NAME_MAX_LENGTH) {
        recipientName = recipientName.substring(0, PaymentConstants.RECIPIENT_NAME_MAX_LENGTH - randomUniqueNumber.length) + randomUniqueNumber;
      } else {
        recipientName += randomUniqueNumber;
        if (recipientName.length > PaymentConstants.RECIPIENT_NAME_MAX_LENGTH) {
          recipientName = recipientName.substring(0, PaymentConstants.RECIPIENT_NAME_MAX_LENGTH);
        }
      }
    }
    inputDataMap.recipientName = recipientName;

    // VENDOR NUMBER
    let vendorNumber = JsonUtils.getStringValue(inputDataMap, "createRecipient.vendorNumber") || "";

    if (vendorNumber.length > 0) {
      if (vendorNumber.length >= PaymentConstants.VENDOR_NUMBER_MAX_LENGTH) {
        vendorNumber = vendorNumber.substring(0, PaymentConstants.VENDOR_NUMBER_MAX_LENGTH - randomUniqueNumber.length) + randomUniqueNumber;
      } else {
        vendorNumber += randomUniqueNumber;
        if (vendorNumber.length > PaymentConstants.VENDOR_NUMBER_MAX_LENGTH) {
          vendorNumber = vendorNumber.substring(0, PaymentConstants.VENDOR_NUMBER_MAX_LENGTH);
        }
      }
    }
    inputDataMap.vendorNumber = vendorNumber;

    // ACCOUNT NICKNAMES
    const totalAccounts = Number(inputDataMap.createRecipient.totalAccount);

    for (let i = 0; i < totalAccounts; i++) {
      let nickname = JsonUtils.getStringValue(inputDataMap, `createRecipient.recipientAddresses[${i}].accountNickname`) || "";

      if (nickname.length > 0) {
        if (nickname.length >= PaymentConstants.RECIPIENT_NICKNAME_MAX_LENGTH) {
          nickname = nickname.substring(0, PaymentConstants.RECIPIENT_NICKNAME_MAX_LENGTH - randomUniqueNumber.length) + randomUniqueNumber;
        } else {
          nickname += randomUniqueNumber;
          if (nickname.length > PaymentConstants.RECIPIENT_NICKNAME_MAX_LENGTH) {
            nickname = nickname.substring(0, PaymentConstants.RECIPIENT_NICKNAME_MAX_LENGTH);
          }
        }
      }

      inputDataMap[`accountNickname${i + 1}`] = nickname;
    }

    return inputDataMap;
  }

   async appendUniqueNumber(name: string, uniqueNumber: string, maxLength: number) {
    if (!name) return name;

    if (name.length >= maxLength) {
      name = name.substring(0, maxLength - uniqueNumber.length) + uniqueNumber;
    } else {
      name = name + uniqueNumber;

      if (name.length > maxLength) {
        name = name.substring(0, maxLength);
      }
    }

    return name;
  }

  async appendUniqueNumberToStr(str: string, uniqueNumber: string, maxLength: number): Promise<string> {
    if (!str || str.length === 0) return str;

    if (str.length >= maxLength) {
      return str.substring(0, maxLength - uniqueNumber.length) + uniqueNumber;
    }

    const updated = str + uniqueNumber;
    return updated.length > maxLength ? updated.substring(0, maxLength) : updated;
  }

  async updateUniqueDataInProfileMap(inputDataMap: any, randomUniqueNumber: string) {
    let profileName = JsonUtils.getStringValue(inputDataMap, "testdata.createRecipient.profileInformation.profileName") || "";
    const updatedProfileName = this.appendUniqueNumberToStr(profileName, randomUniqueNumber, PaymentConstants.PROFILE_NAME_MAX_LENGTH);
    inputDataMap["profileName"] = updatedProfileName;


    const recipient = JsonUtils.getListFromMap(inputDataMap, "testdata.createRecipient.recipients") || [];
    for (let i = 0; i < recipient.length; i++) {
      const recipientName = JsonUtils.getStringValue(inputDataMap, `testdata.createRecipient.recipients[${i}].recipientInformation.recipientName`) || "";
      const updatedRecipientName = this.appendUniqueNumberToStr(recipientName, randomUniqueNumber, PaymentConstants.RECIPIENT_NAME_MAX_LENGTH);
      inputDataMap[`recipientName`] = updatedRecipientName;

      const baseAccountNickname = JsonUtils.getStringValue(inputDataMap, `testdata.createRecipient.recipients[${i}].recipientInformation.accountNickname`) || "";
      const accountNickname = recipient.length < 2 ? baseAccountNickname : baseAccountNickname + `${i + 1}_`;
      const updatedNickname = this.appendUniqueNumberToStr(accountNickname, randomUniqueNumber, PaymentConstants.RECIPIENT_NICKNAME_MAX_LENGTH);
      inputDataMap[`accountNickname${i + 1}`] = updatedNickname;
    }
    return inputDataMap;
  }
}