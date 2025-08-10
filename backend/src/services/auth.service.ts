import mongoose from "mongoose";
import UserModel from "../models/user.model";
import { UnauthorizedException } from "../utils/app-error";
import { RegisterSchemaType } from "../validators/auth.validator";
import ReportSettingModel, {
  ReportFrequencyEnum,
} from "../models/report-setting.model";
import { calculateNextReportDate } from "../utils/helper";

export const registerService = async (body: RegisterSchemaType) => {
  const { email } = body;

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {});
    const existingUser = await UserModel.findOne({
      email,
    });

    if (existingUser) {
      throw new UnauthorizedException("User already exists");
    }

    const newUser = new UserModel({
      ...body,
    });

    await newUser.save({ session });

    const reportSetting = new ReportSettingModel({
      userId: newUser?.id,
      frequency: ReportFrequencyEnum.MONTHLY,
      isEnabled: true,
      lastSentDate: null,
      nextReportDate: calculateNextReportDate(),
    });

    await reportSetting.save({ session });

    return { user: newUser.omitPassword() };
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};
