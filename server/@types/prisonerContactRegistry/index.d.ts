/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/prisoners/{prisonerId}/contacts': {
    /** Returns details of a prisoner contacts */
    get: operations['getPrisonerContact']
  }
}

export interface components {
  schemas: {
    ErrorResponse: {
      /** Format: int32 */
      status: number
      /** Format: int32 */
      errorCode?: number
      userMessage?: string
      developerMessage?: string
    }
    /** @description An address */
    AddressDto: {
      /**
       * @description Address Type
       * @example BUS
       */
      addressType?: string
      /**
       * @description Flat
       * @example 3B
       */
      flat?: string
      /**
       * @description Premise
       * @example Liverpool Prison
       */
      premise?: string
      /**
       * @description Street
       * @example Slinn Street
       */
      street?: string
      /**
       * @description Locality
       * @example Brincliffe
       */
      locality?: string
      /**
       * @description Town/City
       * @example Liverpool
       */
      town?: string
      /**
       * @description Postal Code
       * @example LI1 5TH
       */
      postalCode?: string
      /**
       * @description County
       * @example HEREFORD
       */
      county?: string
      /**
       * @description Country
       * @example ENG
       */
      country?: string
      /**
       * @description Additional Information
       * @example This is a comment text
       */
      comment?: string
      /**
       * @description Primary Address
       * @example false
       */
      primary: boolean
      /**
       * @description No Fixed Address
       * @example false
       */
      noFixedAddress: boolean
      /**
       * Format: date
       * @description Date Added
       * @example 2000-10-31
       */
      startDate?: string
      /**
       * Format: date
       * @description Date ended
       * @example 2000-10-31
       */
      endDate?: string
      /** @description The phone number associated with the address */
      phones: components['schemas']['TelephoneDto'][]
      /** @description The address usages/types */
      addressUsages: components['schemas']['AddressUsageDto'][]
    }
    /** @description An Offender's address usage */
    AddressUsageDto: {
      /**
       * @description The address usages
       * @example HDC
       */
      addressUsage?: string
      /**
       * @description The address usages description
       * @example HDC Address
       */
      addressUsageDescription?: string
      /**
       * @description Active Flag
       * @example true
       */
      activeFlag?: boolean
    }
    /** @description A contact for a prisoner */
    ContactDto: {
      /**
       * Format: int64
       * @description Identifier for this contact (Person in NOMIS)
       * @example 5871791
       */
      personId?: number
      /**
       * @description First name
       * @example John
       */
      firstName: string
      /**
       * @description Middle name
       * @example Mark
       */
      middleName?: string
      /**
       * @description Last name
       * @example Smith
       */
      lastName: string
      /**
       * Format: date
       * @description Date of birth
       * @example 1980-01-28
       */
      dateOfBirth?: string
      /**
       * @description Code for relationship to Prisoner
       * @example RO
       */
      relationshipCode: string
      /**
       * @description Description of relationship to Prisoner
       * @example Responsible Officer
       */
      relationshipDescription?: string
      /**
       * @description Type of Contact
       * @example O
       */
      contactType: string
      /**
       * @description Description of Contact Type
       * @example Official
       */
      contactTypeDescription?: string
      /** @description Approved Visitor Flag */
      approvedVisitor: boolean
      /** @description Emergency Contact Flag */
      emergencyContact: boolean
      /** @description Next of Kin Flag */
      nextOfKin: boolean
      /** @description List of restrictions associated with the contact */
      restrictions: components['schemas']['RestrictionDto'][]
      /** @description List of addresses associated with the contact */
      addresses: components['schemas']['AddressDto'][]
      /**
       * @description Additional Information
       * @example This is a comment text
       */
      commentText?: string
    }
    /** @description A contact for a prisoner */
    RestrictionDto: {
      /**
       * @description Restriction Type Code
       * @example 123
       */
      restrictionType: string
      /**
       * @description Description of Restriction Type
       * @example 123
       */
      restrictionTypeDescription: string
      /**
       * Format: date
       * @description Date from which the restriction applies
       * @example 2000-10-31
       */
      startDate: string
      /**
       * Format: date
       * @description Restriction Expiry
       * @example 2000-10-31
       */
      expiryDate?: string
      /** @description True if applied globally to the contact or False if applied in the context of a visit */
      globalRestriction: boolean
      /**
       * @description Additional Information
       * @example This is a comment text
       */
      comment?: string
    }
    /** @description Telephone Details */
    TelephoneDto: {
      /**
       * @description Telephone number
       * @example 0114 2345678
       */
      number: string
      /**
       * @description Telephone type
       * @example TEL
       */
      type: string
      /**
       * @description Telephone extension number
       * @example 123
       */
      ext?: string
    }
  }
}

export interface operations {
  /** Returns details of a prisoner contacts */
  getPrisonerContact: {
    parameters: {
      path: {
        /** Prisoner Identifier (NOMIS Offender No) */
        prisonerId: string
      }
      query: {
        /** Query by Type (NOMIS Contact Type) */
        type?: string
        /** Query by Person Identifier (NOMIS Person ID) */
        id?: number
      }
    }
    responses: {
      /** Prisoner Contacts Information Returned */
      200: {
        content: {
          'application/json': components['schemas']['ContactDto'][]
        }
      }
      /** Incorrect request to Get Prisoner Contacts for Prisoner Identifier */
      400: {
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** Unauthorized to access this endpoint */
      401: {
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** Incorrect permissions retrieve a Prisoner Contacts */
      403: {
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** Prisoner not found */
      404: {
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
}
