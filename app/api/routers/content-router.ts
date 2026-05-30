import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import {
  getActiveFaqs,
  getAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getActivePartnerLogos,
  getAllPartnerLogos,
  createPartnerLogo,
  updatePartnerLogo,
  deletePartnerLogo,
} from "../queries/content";

export const contentRouter = createRouter({
  faqs: publicQuery.query(async () => {
    return getActiveFaqs();
  }),

  allFaqs: adminQuery.query(async () => {
    return getAllFaqs();
  }),

  createFaq: adminQuery
    .input(z.object({ question: z.string(), answer: z.string(), displayOrder: z.number().optional() }))
    .mutation(async ({ input }) => {
      return createFaq(input);
    }),

  updateFaq: adminQuery
    .input(z.object({ id: z.number(), question: z.string().optional(), answer: z.string().optional(), displayOrder: z.number().optional(), active: z.boolean().optional() }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateFaq(id, data);
      return { success: true };
    }),

  deleteFaq: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteFaq(input.id);
      return { success: true };
    }),

  partnerLogos: publicQuery.query(async () => {
    return getActivePartnerLogos();
  }),

  allPartnerLogos: adminQuery.query(async () => {
    return getAllPartnerLogos();
  }),

  createPartnerLogo: adminQuery
    .input(z.object({ name: z.string(), logoUrl: z.string(), url: z.string().optional(), displayOrder: z.number().optional() }))
    .mutation(async ({ input }) => {
      return createPartnerLogo(input);
    }),

  updatePartnerLogo: adminQuery
    .input(z.object({ id: z.number(), name: z.string().optional(), logoUrl: z.string().optional(), url: z.string().optional(), displayOrder: z.number().optional(), active: z.boolean().optional() }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updatePartnerLogo(id, data);
      return { success: true };
    }),

  deletePartnerLogo: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deletePartnerLogo(input.id);
      return { success: true };
    }),
});
