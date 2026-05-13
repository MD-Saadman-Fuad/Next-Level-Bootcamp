class BankAccount {
  readonly userId: number;
  public userName: string;
  protected userBalance: number;

  constructor(userId: number, userName: string, userBalance: number) {
    this.userId = userId;
    this.userName = userName;
    this.userBalance = userBalance;
  }

  addBalance(amount: number): void {
    this.userBalance += amount;
  }
}

class StudentBankAccount extends BankAccount {
  constructor(userId: number, userName: string, userBalance: number) {
    super(userId, userName, userBalance);
  }
  addBonus() {
    this.addBalance(100); // Adding a bonus for student accounts
  }
}

const account1 = new BankAccount(1, "Alice", 1000);
const account2 = new BankAccount(2, "Bob", 2000);
const studentAccount = new StudentBankAccount(3, "Charlie", 1500);


account1.addBalance(500);
account2.addBalance(1000);
studentAccount.addBonus();
