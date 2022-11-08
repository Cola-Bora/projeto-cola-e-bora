import { AppError } from "../../errors";
import AppDataSource from "../../data-source";
import { IDonation } from "../../interfaces/donation";
import { Donations } from "../../entities/donation";
import { User } from "../../entities/user";
import { Ongs } from "../../entities/ong";

export default async function createDonationServices(
  userId: string,
  ongId: string,
  donation: IDonation
) {
  if (Object.keys(donation).length !== 1) {
    throw new AppError("Required field is missing");
  }

  if (typeof donation.value !== "number") {
    throw new AppError("Declared value is not of type number");
  }

  const userData = AppDataSource.getRepository(User);
  const user = await userData.findOneBy({ id: userId });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const ongData = AppDataSource.getRepository(Ongs);
  const ong = await ongData.findOneBy({ id: ongId });

  if (!ong) {
    throw new AppError("Ong not found", 404);
  }

  const donationData = AppDataSource.getRepository(Donations);

  const newDonation = donationData.create({
    value: donation.value,
    date: new Date().toISOString(),
    user: user,
    ong: ong,
  });

  await donationData.save(newDonation);

  const historicDonations = ong.balance;

  const donationToFixed = donation.value.toFixed(2);
  const donationNumber = parseFloat(donationToFixed);

  await ongData.update(ong.id, {
    balance: donation.value
      ? donationNumber + historicDonations
      : historicDonations,
  });

  return "Successfully received donation";
}
