import {MailerModule} from '@nestjs-modules/mailer';
import {Module} from '@nestjs/common';
import {MailService} from './mail.service';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: process.env.MAIL_HOST || 'smtp.gmail.com',
                secure: true,
                auth: {
                    user: process.env.MAIL_USER || 'nhat.oreilly.first@gmail.com',
                    pass: process.env.MAIL_PASS || '3HnbWA$iM?zdWZN',
                },
            },
            defaults: {
                from: 'Polkafantasy <noreply@polkafantasy.com>',
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService], // 👈 export for DI
})
export class MailModule {
}
