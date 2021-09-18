import { Migration } from '@mikro-orm/migrations';

export class Migration20210913092732 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_account" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "password" text not null);');
    this.addSql('alter table "user_account" add constraint "user_account_name_unique" unique ("name");');

    this.addSql('drop table if exists "user" cascade;');
  }

}
