<template>
  <section class="feather-container">
    <div class="feather-row">
      <FeatherAutocomplete
        class="feather-col-6"
        data-ref-id="test"
        label="Select Users"
        v-model="value"
        :loading="loading"
        :results="results"
        type="multi"
        @search="search"
        background
      ></FeatherAutocomplete>
    </div>
  </section>
</template>
<script lang="ts">
import * as components from "./../src";
import { IAutocompleteItemType } from "@featherds/autocomplete";
import icon from "@featherds/icon/notification/Warning";
const names = [
  "Liam",
  "Emma",
  "Noah",
  "Olivia",
  "William",
  "Ava",
  "James",
  "Isabella",
  "Oliver",
  "Sophia",
  "Benjamin",
  "Charlotte",
  "Elijah",
  "Mia",
  "Lucas",
  "Amelia",
  "Mason",
  "Harper",
  "Logan",
  "Evelyn",
  "Alexander",
  "Abigail",
  "Ethan",
  "Emily",
  "Jacob",
  "Elizabeth",
  "Michael",
  "Mila",
  "Daniel",
  "Ella",
  "Henry",
  "Avery",
  "Jackson",
  "Sofia",
  "Sebastian",
  "Camila",
  "Aiden",
  "Aria",
  "Matthew",
  "Scarlettxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
];
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      timeout: -1,
      loading: false,
      results: [] as IAutocompleteItemType[],
      value: [] as IAutocompleteItemType[],
    };
  },

  methods: {
    search(q: string) {
      this.loading = true;
      clearTimeout(this.timeout);
      this.timeout = window.setTimeout(() => {
        this.results = names
          .filter((x) => x.toLowerCase().indexOf(q.toLowerCase()) > -1)
          .map((x) => {
            return {
              _text: x,
            };
          });
        this.loading = false;
      }, 500);
    },
  },
  components: {
    ...components,
  },
});
</script>
<style lang="scss" scoped>
.my-autocomplete {
  width: 25rem !important;
}
</style>
